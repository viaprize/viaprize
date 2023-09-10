import { User } from '@/backend/src/users/entities/user.entity';
import { CreateUserDto } from '@/backend/src/users/dto/create-user.dto';
interface AppUser extends User {}
interface CreateUserDto extends CreateUserDto {}
