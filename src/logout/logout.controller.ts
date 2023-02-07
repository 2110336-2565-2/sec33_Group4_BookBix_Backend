import { Controller, Get } from '@nestjs/common';

@Controller('logout')
export class LogoutController {

    @Get()
    getLogout(){
        return "test";
    }
}
