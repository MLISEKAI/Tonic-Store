import { IconItem } from "../types/index";
import VisaIcon  from "../assets/icons/VisaIcon";
import MastercardIcon from "../assets/icons/MastercardIcon";
import VNPayIcon  from "../assets/icons/VNPayIcon";
import CashondeliveryIcon  from "../assets/icons/CashondeliveryIcon";

export const paymentIcons: IconItem[] = [
  { name: "Visa", svg: VisaIcon, link: "https://www.visa.com.vn/" },
  { name: "MasterCard", svg: MastercardIcon, link: "https://www.mastercard.com.vn/" },
  { name: "VNPay", svg: VNPayIcon, link: "https://vnpay.vn/" },
  { name: "COD", svg: CashondeliveryIcon, link: "#" },

];
