import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractTokenFromCookies } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';

// Simple in-memory rate limiting
const uploadAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_UPLOADS_PER_MINUTE = 5;

// POST /api/users/avatar - Upload avatar image (Base64)
export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromCookies(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Rate limiting
    const now = Date.now();
    const userAttempts = uploadAttempts.get(decoded.userId);
    if (userAttempts) {
      if (now < userAttempts.resetAt) {
        if (userAttempts.count >= MAX_UPLOADS_PER_MINUTE) {
          return NextResponse.json(
            { error: 'Too many upload attempts. Please try again later.' },
            { status: 429 }
          );
        }
        userAttempts.count++;
      } else {
        uploadAttempts.set(decoded.userId, { count: 1, resetAt: now + 60000 });
      }
    } else {
      uploadAttempts.set(decoded.userId, { count: 1, resetAt: now + 60000 });
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate base64 image
    const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    if (!base64Pattern.test(image)) {
      return NextResponse.json(
        { error: 'Invalid image format. Supported: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }

    // Check file size (rough estimate from base64 - max 2MB)
    const base64Data = image.split(',')[1];
    const sizeInBytes = (base64Data.length * 3) / 4;
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (sizeInBytes > maxSize) {
      return NextResponse.json(
        { error: 'Image too large. Maximum size is 2MB.' },
        { status: 400 }
      );
    }

    await connectDB();

    // For now, store the base64 data URL directly
    // In production, you'd upload to S3/Cloudinary and store the URL
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: { avatar: image } },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      avatar: user.avatar,
      message: 'Profile photo updated successfully',
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/avatar - Remove avatar
export async function DELETE(request: NextRequest) {
  try {
    const token = extractTokenFromCookies(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $unset: { avatar: 1 } },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile photo removed',
    });
  } catch (error) {
    console.error('Error removing avatar:', error);
    return NextResponse.json(
      { error: 'Failed to remove image' },
      { status: 500 }
    );
  }
}
