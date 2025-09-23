import { IconItem } from "../types/index";
import VisaIcon  from "../assets/icons/VisaIcon";
import MastercardIcon from "../assets/icons/MastercardIcon";
import VNPayIcon  from "../assets/icons/VNPayIcon";
import CashondeliveryIcon  from "../assets/icons/CashondeliveryIcon";

export const paymentIcons: IconItem[] = [
  { name: "Visa", svg: VisaIcon },
  { name: "MasterCard", svg: MastercardIcon },
  { name: "VNPay", svg: VNPayIcon },
  { name: "COD", svg: CashondeliveryIcon },

];
