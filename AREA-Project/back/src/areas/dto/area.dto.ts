export class CreateAreaDto {
  name: string;
  description?: string;
  actionId: number;
  actionServiceId: number;
  actionParams?: Record<string, any>;
  reactionId: number;
  reactionServiceId: number;
  reactionParams?: Record<string, any>;
}

export class UpdateAreaDto {
  name?: string;
  description?: string;
  actionParams?: Record<string, any>;
  reactionParams?: Record<string, any>;
  isActive?: boolean;
}
