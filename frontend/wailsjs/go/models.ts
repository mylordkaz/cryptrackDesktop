export namespace models {
	
	export class Crypto {
	    symbol: string;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new Crypto(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.symbol = source["symbol"];
	        this.name = source["name"];
	    }
	}
	export class Transaction {
	    id: string;
	    CryptoSymbol: string;
	    amount: number;
	    price: number;
	    total: number;
	    // Go type: time
	    date: any;
	    type: string;
	
	    static createFrom(source: any = {}) {
	        return new Transaction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.CryptoSymbol = source["CryptoSymbol"];
	        this.amount = source["amount"];
	        this.price = source["price"];
	        this.total = source["total"];
	        this.date = this.convertValues(source["date"], null);
	        this.type = source["type"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

