import { beginCell, toNano, Address } from '@ton/ton'

const userAddress =  Address.parse("EQDaESRC3ynZT4DnNsxLpNvH_Lry7j_T6RKBFKBp5WucSzrr");
const addressCell = beginCell().storeAddress(userAddress).endCell();
console.log(addressCell)
export { addressCell };