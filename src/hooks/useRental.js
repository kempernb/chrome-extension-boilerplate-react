import { useContext } from "react";
import RentalContext from "../contexts/RentalContext";

const useRental = () => useContext(RentalContext);

export default useRental;
