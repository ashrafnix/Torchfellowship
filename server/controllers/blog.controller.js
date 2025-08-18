
import { getDb } from '../db/index.js';
import { ObjectId } from 'mongodb';
import AppError from '../utils/AppError.js';

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

const formatPostForClient = (post) => {
    if (!post) return null;
    const { _id, ...rest } = post;
    return {
        _id: _id.toHexString(),
        ...rest
    };
};

// --- ADMIN ---

export const createPost = async (req, res, next) => {
    try {
        const { title, content, featureImageUrl, status } = req.body;
        if (!title || !content || !featureImageUrl || !status) {
            return next(new AppError('Title, content, feature image, and status are required.', 400));
        }

        const db = getDb();
        const slug = generateSlug(title);

        const newPost = {
            title,
            slug,
            content,
            featureImageUrl,
            status,
            authorId: req.user._id.toHexString(),
            authorName: req.user.fullName || req.user.email,
            createdAt: new Date().toISOString(),
            publishedAt: status === 'published' ? new Date().toISOString() : null,
        };

        const result = await db.collection('blog_posts').insertOne(newPost);
        const createdPost = { ...newPost, _id: result.insertedId };
        
        res.status(201).json(formatPostForClient(createdPost));
    } catch (error) {
        next(new AppError('Failed to create blog post.', 500));
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, featureImageUrl, status } = req.body;
        
        const db = getDb();
        const existingPost = await db.collection('blog_posts').findOne({ _id: new ObjectId(id) });
        if (!existingPost) {
            return next(new AppError('Blog post not found.', 404));
        }

        const updateData = {};
        if (title) {
            updateData.title = title;
            updateData.slug = generateSlug(title);
        }
        if (content) updateData.content = content;
        if (featureImageUrl) updateData.featureImageUrl = featureImageUrl;
        if (status) {
            updateData.status = status;
            if (status === 'published' && !existingPost.publishedAt) {
                updateData.publishedAt = new Date().toISOString();
            }
        }

        const result = await db.collection('blog_posts').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        
        res.status(200).json(formatPostForClient(result.value));
    } catch (error) {
        next(new AppError('Failed to update blog post.', 500));
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDb();
        const result = await db.collection('blog_posts').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return next(new AppError('Blog post not found.', 404));
        res.status(204).send();
    } catch (error) {
        next(new AppError('Failed to delete blog post.', 500));
    }
};

export const getAllPostsAdmin = async (req, res, next) => {
    try {
        const db = getDb();
        const posts = await db.collection('blog_posts').find({}).sort({ createdAt: -1 }).toArray();
        res.status(200).json(posts.map(formatPostForClient));
    } catch (error) {
        next(new AppError('Failed to fetch posts for admin.', 500));
    }
};

// --- PUBLIC ---

export const getPublishedPosts = async (req, res, next) => {
    try {
        const db = getDb();
        const posts = await db.collection('blog_posts')
            .find({ status: 'published' })
            .sort({ publishedAt: -1 })
            .toArray();
        res.status(200).json(posts.map(formatPostForClient));
    } catch (error) {
        next(new AppError('Failed to fetch published posts.', 500));
    }
};

export const getPostBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const db = getDb();
        const post = await db.collection('blog_posts').findOne({ slug: slug, status: 'published' });
        if (!post) {
            return next(new AppError('Blog post not found or not published.', 404));
        }
        res.status(200).json(formatPostForClient(post));
    } catch (error) {
        next(new AppError('Failed to fetch blog post.', 500));
    }
};