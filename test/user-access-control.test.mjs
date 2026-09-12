import test from 'node:test';
import assert from 'node:assert/strict';

// Roles enum matching @prisma/client
const RoleType = {
  CUSTOMER: 'CUSTOMER',
  PARTNER: 'PARTNER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  OPERATIONS: 'OPERATIONS',
};

/**
 * Access Control Evaluator for User Profiles and Details
 */
function evaluateUserProfileAccess(targetUserId, requestingUser) {
  const isAdmin =
    requestingUser.roles?.includes(RoleType.ADMIN) ||
    requestingUser.roles?.includes(RoleType.SUPER_ADMIN);

  const isSelf = requestingUser.userId === targetUserId;

  if (!isAdmin && !isSelf) {
    const error = new Error(
      'Access denied: You cannot view the profile or details of other users. Only administrators have permission to view all user details.',
    );
    error.statusCode = 403;
    throw error;
  }

  return {
    allowed: true,
    viewMode: isAdmin && !isSelf ? 'ADMIN_INSPECTION' : 'SELF_VIEW',
    canViewSensitiveDocuments: isAdmin,
    canViewAuditLogs: isAdmin,
  };
}

/**
 * Access Control Evaluator for Users Directory Listing
 */
function evaluateUserDirectoryAccess(requestingUser) {
  const isAdmin =
    requestingUser.roles?.includes(RoleType.ADMIN) ||
    requestingUser.roles?.includes(RoleType.SUPER_ADMIN);

  if (!isAdmin) {
    const error = new Error('Access denied: role not authorized for this resource');
    error.statusCode = 403;
    throw error;
  }

  return { allowed: true };
}

/**
 * Access Control Evaluator for Order & Customer Information
 */
function evaluateOrderAccess(order, requestingUser) {
  const isAdmin =
    requestingUser.roles?.includes(RoleType.ADMIN) ||
    requestingUser.roles?.includes(RoleType.SUPER_ADMIN) ||
    requestingUser.roles?.includes(RoleType.OPERATIONS);

  const isOwnerCustomer =
    requestingUser.customerId && order.customerId === requestingUser.customerId;
  const isAssignedPartner =
    requestingUser.partnerId && order.partnerId === requestingUser.partnerId;

  if (!isAdmin && !isOwnerCustomer && !isAssignedPartner) {
    const error = new Error(
      "Access denied: You do not have permission to view other users' order details",
    );
    error.statusCode = 403;
    throw error;
  }

  return { allowed: true };
}

test('User Privacy & Access Control Suite', async (t) => {
  const customerUser = {
    userId: 'usr-customer-003',
    customerId: 'cust-101',
    roles: [RoleType.CUSTOMER],
  };

  const otherCustomerUser = {
    userId: 'usr-customer-004',
    customerId: 'cust-102',
    roles: [RoleType.CUSTOMER],
  };

  const partnerUser = {
    userId: 'usr-partner-002',
    partnerId: 'ptr-201',
    roles: [RoleType.PARTNER],
  };

  const adminUser = {
    userId: 'usr-admin-001',
    roles: [RoleType.ADMIN],
  };

  const superAdminUser = {
    userId: 'usr-admin-002',
    roles: [RoleType.SUPER_ADMIN],
  };

  await t.test('1. User can view their own profile and details', () => {
    const result = evaluateUserProfileAccess(customerUser.userId, customerUser);
    assert.equal(result.allowed, true);
    assert.equal(result.viewMode, 'SELF_VIEW');
  });

  await t.test('2. Partner can view their own profile and details', () => {
    const result = evaluateUserProfileAccess(partnerUser.userId, partnerUser);
    assert.equal(result.allowed, true);
    assert.equal(result.viewMode, 'SELF_VIEW');
  });

  await t.test('3. Regular user CANNOT view another user profile or details (403 Forbidden)', () => {
    assert.throws(
      () => evaluateUserProfileAccess(otherCustomerUser.userId, customerUser),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /Access denied: You cannot view the profile or details of other users/);
        return true;
      },
    );
  });

  await t.test('4. Partner CANNOT view customer full user profile or details (403 Forbidden)', () => {
    assert.throws(
      () => evaluateUserProfileAccess(customerUser.userId, partnerUser),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /Only administrators have permission to view all user details/);
        return true;
      },
    );
  });

  await t.test('5. Admin CAN view any user profile and details with administrative privileges', () => {
    const result = evaluateUserProfileAccess(customerUser.userId, adminUser);
    assert.equal(result.allowed, true);
    assert.equal(result.viewMode, 'ADMIN_INSPECTION');
    assert.equal(result.canViewSensitiveDocuments, true);
    assert.equal(result.canViewAuditLogs, true);
  });

  await t.test('6. Super Admin CAN view any user profile and details', () => {
    const result = evaluateUserProfileAccess(partnerUser.userId, superAdminUser);
    assert.equal(result.allowed, true);
    assert.equal(result.viewMode, 'ADMIN_INSPECTION');
    assert.equal(result.canViewSensitiveDocuments, true);
  });

  await t.test('7. Only Admin can list all users in the users directory', () => {
    // Admin allowed
    assert.equal(evaluateUserDirectoryAccess(adminUser).allowed, true);
    assert.equal(evaluateUserDirectoryAccess(superAdminUser).allowed, true);

    // Customer blocked
    assert.throws(
      () => evaluateUserDirectoryAccess(customerUser),
      (err) => {
        assert.equal(err.statusCode, 403);
        return true;
      },
    );

    // Partner blocked
    assert.throws(
      () => evaluateUserDirectoryAccess(partnerUser),
      (err) => {
        assert.equal(err.statusCode, 403);
        return true;
      },
    );
  });

  await t.test('8. Orders access control prevents cross-user exposure of personal details', () => {
    const order = {
      id: 'GS-2026-10492',
      customerId: 'cust-101',
      partnerId: 'ptr-201',
    };

    // Owner customer can view
    assert.equal(evaluateOrderAccess(order, customerUser).allowed, true);

    // Assigned partner can view
    assert.equal(evaluateOrderAccess(order, partnerUser).allowed, true);

    // Admin can view
    assert.equal(evaluateOrderAccess(order, adminUser).allowed, true);

    // Unrelated customer cannot view other user order details
    assert.throws(
      () => evaluateOrderAccess(order, otherCustomerUser),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /Access denied: You do not have permission to view other users' order details/);
        return true;
      },
    );
  });
});
