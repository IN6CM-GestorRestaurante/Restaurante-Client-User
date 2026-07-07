// src/shared/utils/pricing.js

/**
 * Calcula la promoción vigente de un platillo (si la tiene) y su precio con descuento.
 * Misma lógica que usa el backend (ServerUser/helpers/pricing.js) para no mostrar un
 * precio que luego no coincida con lo que realmente se cobra.
 */
export const getActivePromotion = (item) => {
    const promotion = item?.promotion;
    if (!promotion?.isActive) return null;

    const now = new Date();
    if (promotion.startsAt && now < new Date(promotion.startsAt)) return null;
    if (promotion.endsAt && now > new Date(promotion.endsAt)) return null;

    const price = Number(item.price) || 0;
    const value = Number(promotion.discountValue) || 0;
    let discountedPrice = price;
    let label = "";

    switch (promotion.discountType) {
        case "PERCENTAGE":
        case "PORCENTAJE":
            discountedPrice = price - (price * value) / 100;
            label = `-${value}%`;
            break;
        case "FIXED_PRICE":
            discountedPrice = value;
            label = "Precio especial";
            break;
        case "FIXED":
        case "FIJO":
            discountedPrice = price - value;
            label = `-Q${value}`;
            break;
        default:
            return null;
    }

    discountedPrice = Math.max(0, discountedPrice);
    if (discountedPrice >= price) return null;

    return { discountedPrice, originalPrice: price, label };
};
