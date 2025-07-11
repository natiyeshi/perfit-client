import { Iintical } from "./page";

export const ShowTable = ({ values }: { values: Iintical }) => {
    return (
      <div>
        <div className="w-full flex flex-col">
          <div className="grid grid-cols-7 border gap-2 bg-secondary text-white py-2 px-4 items-center place-content-center place-items-center">
            <div>Product Name</div>
            <div>Quantity</div>
            <div>Expiry Date</div>
            <div>Manufacture Date</div>
            <div>Purchase Price</div>
            <div>Selling Price</div>
            <div>Total Price (USD)</div>
          </div>
          {values.products.map((value, ind) => (
            <div
              key={ind}
              className="grid grid-cols-7 border gap-2  py-2 px-4 items-center place-content-center place-items-center"
            >
              <div>{value.product?.genericName}</div>
              <div>{value.quantity}</div>
              <div>{value.expiryDate}</div>
              <div>{value.manufactureDate}</div>
              <div>{value.purchasePriceUsd}</div>
              <div>{value.currentSellingPrice}</div>
              <div>{value.purchasePriceUsd * value.quantity}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };