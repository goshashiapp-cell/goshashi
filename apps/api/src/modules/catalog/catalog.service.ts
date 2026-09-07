import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) { }

  async getCategories() {
    return this.prisma.category.findMany({
      where: { status: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: { where: { status: true } },
        services: {
          where: { status: true },
          include: {
            images: true,
            addons: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category '${slug}' not found`);
    }

    return category;
  }

  async getServices(query: {
    categorySlug?: string;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const where: any = { status: true };

    if (query.categorySlug) {
      where.category = { slug: query.categorySlug };
    }

    if (query.featured !== undefined) {
      where.featured = String(query.featured) === 'true';
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { shortDescription: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { featured: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: true,
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data: services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getServiceBySlug(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        faqs: { orderBy: { sortOrder: 'asc' } },
        includedItems: true,
        excludedItems: true,
        addons: { where: { status: true } },
        reviews: {
          where: { isApproved: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException(`Service '${slug}' not found`);
    }

    return service;
  }

  async getBanners() {
    return this.prisma.banner.findMany({
      where: { status: true },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
