export class updateUserDto {
    readonly location: string;
    readonly tele_id: string;
    readonly  notification_preference: string;
    readonly username: string;
    readonly isBlocked: boolean; // Add the new boolean field
    readonly isSubscribed: boolean;
}
