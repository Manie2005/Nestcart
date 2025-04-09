import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { Request } from "express";
@Injectable()
export class AuthGuard implements CanActivate{
constructor(private jwtservice:JwtService){}

async canActivate(context: ExecutionContext): Promise<boolean>{
    const request =context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request);
    if (!token){
        throw new UnauthorizedException('Unauthorized Access');
    }
    try{
        const payload =await this.jwtservice.verifyAsync(
            token,{
                secret:jwtConstants.secret
            }
        );
        request['user'] = payload;
    }    
    catch{
        throw new UnauthorizedException('Unauthorized access')
    }
    return true;
}
private extractTokenFromHeader(request:Request):string|undefined{
    const [type,token] = request.headers.authorization?.split('')??[];
    return type === 'Bearer'? token:undefined;
}




}