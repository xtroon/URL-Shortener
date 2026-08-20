const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const encodeBase62 = (num: number): string =>{
    if(num == 0) return BASE62_CHARS[0];

    let res = "";
    while(num > 0){
        const rem = num%62;
        res = BASE62_CHARS[rem] + res;
        num = Math.floor(num/62);
    }
    return res;
}


export const decodeBase62 = (str: string): number =>{
    let num = 0;
    for(let i =0; i < str.length; i++){
        const idx = BASE62_CHARS.indexOf(str[i]);
        if(idx == -1) throw new Error("Invalid Base62 Character");
        num = num*62 + idx;
    }
    return num;
}