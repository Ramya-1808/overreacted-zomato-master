import React, { useState } from "react";
import "./exploreCard.css";
import fire from "../../../../fire.js";

const handleOrder = (id, chef, setOrderState) => {
  const db = fire.database();
  const userName = localStorage.getItem("Current User").split(/@|\./).join("");
  const userOrders = db.ref(userName + "/userOrders");
  userOrders.update({ [id]: chef });
  setOrderState("Ordered");
};

const ExploreCard = ({ restaurant, i, showVal, setWasOrderCancelled }) => {
  const handleCancel = async (id, chef) => {
    const db = fire.database();
    const userName = localStorage
      .getItem("Current User")
      .split(/@|\./)
      .join("");
    const userOrders = db.ref(userName + "/userOrders").child(id);
    userOrders.remove();
    await setWasOrderCancelled(true);
    setWasOrderCancelled(false);
  };

  const [orderState, setOrderState] = useState("Order");
  const resId = restaurant?.info?.resId;
  const name = restaurant?.info?.name ?? "";
  const coverImg =
    restaurant?.info?.image?.url ?? restaurant?.info?.o2FeaturedImage?.url;
  const deliveryTime = restaurant?.order?.deliveryTime;
  const rating = restaurant?.info?.rating?.rating_text;
  const approxPrice = restaurant?.info?.cfo?.text;
  const offers = restaurant?.bulkOffers ?? [];
  const cuisines = restaurant?.info?.cuisine
    ?.map((item) => item.name)
    .slice(0, 3);
  const bottomContainers = restaurant?.bottomContainers;
  const goldOff = restaurant?.gold?.text;
  const proOff = offers.length > 1 ? offers[0].text : null;
  const discount =
    offers.length > 1
      ? offers[1].text
      : offers.length === 1
      ? offers[0].text
      : null;

  return (
    <div className={`explore-card cur-po ${i < 3 ? "explore-card-first" : ""}`}>
      <div className="explore-card-cover">
        <img
          src={coverImg}
          className="explore-card-image"
          alt={restaurant.info.name}
        />
        {proOff && <div className="pro-off">{proOff}</div>};
        {goldOff && <div className="gold-off absolute-center">{goldOff}</div>}
        {discount && <div className="discount absolute-center">{discount}</div>}
      </div>
      <div className="res-row">
        <div className="res-name">{name}</div>
        {showVal === 1 && (
          <div
            className="res-rating absolute-center"
            onClick={() => {
              handleOrder(resId, cuisines[0], setOrderState);
            }}
          >
            {orderState}
          </div>
        )}
        {showVal === 3 && (
          <div
            className="res-rating res-rating-cancel absolute-center"
            onClick={() => {
              handleCancel(resId, cuisines[0]);
            }}
          >
            Cancel
          </div>
        )}
      </div>
      <div className="res-row">
        {cuisines.length && (
          <div className="res-cuisine">
            {cuisines.map((item, i) => (
              <span className="res-cuisine-tag">
                {item}
                {i !== cuisines.length - 1 && ","}
              </span>
            ))}
          </div>
        )}
        {approxPrice && <div className="res-price">{approxPrice}</div>}
      </div>
      {bottomContainers.length > 0 && (
        <div>
          <div className="card-separator"></div>
          <div className="explore-bottom">
            <img
              src={bottomContainers[0]?.image?.url}
              alt={bottomContainers[0]?.text}
              style={{ height: "18px" }}
            />
            <div className="res-bottom-text">{bottomContainers[0]?.text}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreCard;
