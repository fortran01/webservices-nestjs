import {
  Controller,
  Get,
  Delete,
  Param,
  Res,
  Req,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomCorsGuard } from './common/guards/custom-cors.guard';

/**
 * Controller for handling blog posts.
 */
@Controller('posts')
@UseGuards(CustomCorsGuard)
export class PostsController {
  /**
   * A private dictionary of posts.
   */
  private posts: Record<string, { post: string }> = {
    '1': { post: 'This is the first blog post.' },
    '2': { post: 'This is the second blog post.' },
    '3': { post: 'This is the third blog post.' },
  };

  /**
   * Retrieves all posts.
   * @returns A record of posts.
   */
  @Get()
  getPosts(): Record<string, { post: string }> {
    return this.posts;
  }

  /**
   * Deletes a post by its ID if the requester is the owner.
   * @param postId The ID of the post to delete.
   * @param req The request object.
   * @param res The response object.
   * @returns The HTTP response.
   */
  @Delete(':postId')
  deletePost(
    @Param('postId') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Response {
    const username = req.cookies['username'];
    if (username === 'owner' && this.posts[postId]) {
      delete this.posts[postId];
      return res.status(HttpStatus.NO_CONTENT).send();
    } else if (!this.posts[postId]) {
      return res.status(HttpStatus.NOT_FOUND).send();
    } else {
      return res.status(HttpStatus.FORBIDDEN).send();
    }
  }
}
