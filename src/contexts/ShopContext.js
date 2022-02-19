import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";

const initialShop = {
  products: [],
  addOns: [],
  duration: null,
  startTime: null,
  date: moment().format("YYYY-MM-DD"),
};

export const restoreShop = () => {
  let shop = null;

  try {
    const storedData = window.localStorage.getItem("shop");

    if (storedData) {
      shop = JSON.parse(storedData);

      if (shop.date) {
        //shop.date = moment(shop.date);

        const shopDate = moment(shop.date);

        if (!shopDate.isValid()) {
          shop = initialShop;
        } else if (shopDate.isBefore(moment())) {
          shop.date = moment().format("YYYY-MM-DD");
        }
      }
    } else {
      shop = initialShop;
    }
  } catch (err) {
    console.error(err);
    // If stored data is not a stringified JSON this will fail,
    // that's why we catch the error
  }

  return shop;
};

export const storeShope = (shop) => {
  // shop.date = shop.date.format("YYYY-MM-DD");

  window.localStorage.setItem("shop", JSON.stringify(shop));
};

const ShopContext = createContext({
  shop: initialShop,
});

export const ShopProvider = (props) => {
  const { children } = props;
  const [shop, setShop] = useState(initialShop);

  useEffect(() => {
    const restoredSettings = restoreShop();

    if (restoredSettings) {
      setShop(restoredSettings);
    }
  }, []);

  const saveShop = (updatedShop) => {
    setShop(updatedShop);
    storeShope(updatedShop);
  };

  return (
    <ShopContext.Provider
      value={{
        shop: shop,
        saveShop: saveShop,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

ShopProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const ShopConsumer = ShopContext.Consumer;

export default ShopContext;
