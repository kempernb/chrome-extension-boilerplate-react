import { useContext } from "react";
import ShopContext from './../contexts/ShopContext';

const useShop = () => useContext(ShopContext);

export default useShop;
