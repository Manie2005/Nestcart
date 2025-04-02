import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from 'src/schema/vendor.schema';

@Injectable()
export class VendorService {
constructor(@InjectModel(Vendor.name) private readonly vendorModel: Model<Vendor>,
){}



















}
