// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {models} from '../models';

export function AddTransaction(arg1:string,arg2:number,arg3:number,arg4:number,arg5:string,arg6:string,arg7:string):Promise<void>;

export function DeleteTransaction(arg1:string):Promise<void>;

export function GetCryptosList():Promise<Array<models.Crypto>>;

export function GetTransactions():Promise<Array<models.Transaction>>;

export function IsLoggedIn():Promise<boolean>;

export function LoadTheme():Promise<string>;

export function Login(arg1:string,arg2:string):Promise<void>;

export function Logout():Promise<void>;

export function Register(arg1:string,arg2:string):Promise<void>;

export function SaveTheme(arg1:string):Promise<void>;

export function UpdateTransaction(arg1:string,arg2:number,arg3:number,arg4:number,arg5:string,arg6:string):Promise<void>;
