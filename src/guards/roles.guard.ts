import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean  {
        const requiredRole = this.reflector.get<string>('role', context.getHandler());//Get the role metadata
        if(!requiredRole) return true;
        const request = context.switchToHttp().getRequest();
        const vendor =request.vendor;
        return vendor && vendor.role === requiredRole;
    }
}