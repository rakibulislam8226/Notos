import { SetMetadata } from '@nestjs/common';

// Use this decorator on any controller method to set the "message" field
// in the response. Example: @ResponseMessage('User created successfully')

export const RESPONSE_MESSAGE_KEY = 'response_message';
export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE_KEY, message);
