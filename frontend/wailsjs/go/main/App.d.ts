// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {models} from '../models';

export function AddTransaction(arg1:string,arg2:number,arg3:number,arg4:number,arg5:string,arg6:string,arg7:string):Promise<void>;

export function DeleteTransaction(arg1:string):Promise<void>;

export function GetCryptosList():Promise<Array<models.Crypto>>;

export function GetTransactions():Promise<Array<models.Transaction>>;

export function UpdateTransaction(arg1:string,arg2:string,arg3:number,arg4:number,arg5:number,arg6:string,arg7:string,arg8:string):Promise<void>;
