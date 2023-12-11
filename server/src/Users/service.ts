import fs from 'fs'
import User from '../entities/User';
class UserService {
    private async getAll(): Promise<User[]> {
        const fileData = fs.readFileSync('./src/entities/users.json', 'utf8');
        const fileDataArray = JSON.parse(fileData);
        const users: User[] = []
        fileDataArray.map((item: any) => {
            let user: User = {
                email: item.email,
                number: item.number
            }
            users.push(user);
        })
        return users
    }

    async findAll(email: string, number: string): Promise<User[]> {
        const users = await this.getAll()
        const matchedUser = users.filter((user) => {
            return user.email.includes(email) 
            && user.number?.includes(number)
        })
        return matchedUser
    }
}

export default new UserService()