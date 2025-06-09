import { CarListing } from '../types/auth';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export class CarListingService {
  // Create a new car listing
  async createListing(
    ownerId: string,
    title: string,
    description: string,
    price: number
  ): Promise<CarListing> {
    const listing = await prisma.carListing.create({
      data: {
        ownerId,
        title,
        description,
        price,
        status: 'PENDING',
      },
    });

    // Notify admin about new listing
    await this.notifyAdmin(listing);

    return listing;
  }

  // Notify admin about new listing
  private async notifyAdmin(listing: CarListing): Promise<void> {
    const adminEmails = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { email: true },
    });

    const adminEmailList = adminEmails.map(admin => admin.email);

    if (adminEmailList.length > 0) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: adminEmailList.join(','),
        subject: 'New Car Listing Pending Approval',
        html: `
          <h1>New Car Listing Requires Approval</h1>
          <p>A new car listing has been submitted:</p>
          <ul>
            <li>Title: ${listing.title}</li>
            <li>Description: ${listing.description}</li>
            <li>Price: $${listing.price}</li>
          </ul>
          <p>Please review this listing in the admin dashboard.</p>
        `,
      });
    }
  }

  // Get all pending listings
  async getPendingListings(): Promise<CarListing[]> {
    return prisma.carListing.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get approved listings
  async getApprovedListings(): Promise<CarListing[]> {
    return prisma.carListing.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update listing status
  async updateListingStatus(
    listingId: string,
    status: 'APPROVED' | 'REJECTED',
    adminId: string
  ): Promise<CarListing> {
    const listing = await prisma.carListing.update({
      where: { id: listingId },
      data: { status },
      include: { owner: true },
    });

    // Notify owner about the status change
    await this.notifyOwner(listing, status);

    return listing;
  }

  // Notify owner about listing status change
  private async notifyOwner(listing: CarListing & { owner: { email: string } }, status: string): Promise<void> {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: listing.owner.email,
      subject: `Car Listing ${status}`,
      html: `
        <h1>Car Listing Update</h1>
        <p>Your car listing "${listing.title}" has been ${status.toLowerCase()}.</p>
        ${status === 'APPROVED' 
          ? '<p>Your listing is now visible on the public website.</p>'
          : '<p>Please review our guidelines and submit a new listing.</p>'
        }
      `,
    });
  }

  // Get listings by owner
  async getOwnerListings(ownerId: string): Promise<CarListing[]> {
    return prisma.carListing.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }
} 