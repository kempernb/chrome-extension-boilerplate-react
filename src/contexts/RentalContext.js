import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const initialRental = {
  rental: {
    resourceid: null,
    duration: null,
    addOns: null,
    startTime: null,
  },
};

export const restoreRental = () => {
  let rental = null;

  try {
    const storedData = window.localStorage.getItem("rental");

    if (storedData) {
      rental = JSON.parse(storedData);
    } else {
      rental = {
        initialRental,
      };
    }
  } catch (err) {
    console.error(err);
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return rental;
};

export const storeRental = (rental) => {
  window.localStorage.setItem("rental", JSON.stringify(rental));
};

const RentalContext = createContext({
  rental: initialRental,
});

export const RentalProvider = (props) => {
  const { children } = props;
  const [rental, setRental] = useState(initialRental);

  useEffect(() => {
    const restoredSettings = restoreRental();

    if (restoredSettings) {
      setRental(initialRental);
    }
  }, []);

  const saveRental = (updatedRental) => {
    setRental(updatedRental);
    storeRental(updatedRental);
  };

  return (
    <RentalContext.Provider
      value={{
        rental: rental,
        saveRental: saveRental,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

RentalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const RentalConsumer = RentalContext.Consumer;

export default RentalContext;
