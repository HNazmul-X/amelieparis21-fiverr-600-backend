const CardModel = require("../Model/CardsModel");
const DeliverInfoModel = require("../Model/DelivaryInfoModel");
const ProfileModel = require("../Model/ProfileModel");
const UserModel = require("../Model/UserModel");

exports.createCardPostController = async (req, res, next) => {
    try {
        const { card_base, frontSide, backSide, cardInfo, deliveryInfo, billingInfo, comment_on, promoCode, is_billing_same_delivery } = req.body;
        if (cardInfo) {
            console.log(cardInfo);
            const { firstName, lastName, position, postalCode, email, society, additional_address, company, website, landing, address, quantity, phone, city, country } = cardInfo;
            const isAlreadyHaveCard = await CardModel.findOne({ user: req.user._id });
            if (isAlreadyHaveCard) {
                return res.json({ error: "Sorry You Already Have Card... One User Can Purchase OneCard" });
            }
            const createdCard = await new CardModel({
                user: req.user._id,
                card_base,
                frontSide: {
                    logo: frontSide?.logo,
                    scale: frontSide?.scale,
                },
                backSide: {
                    logo: backSide?.logo,
                    scale: backSide?.scale,
                    infoAlign: backSide?.infoAlign,
                },
                firstname: firstName,
                lastname: lastName,
                position,
                email,
                company,
                website,
                address,
                additional_address,
                quantity,
                landing,
                phone,
                city,
                postalCode,
                country,
                society,
            }).save();

            if (createdCard) {
                const isBillingSameAsDelivery = () => {
                    if (is_billing_same_delivery) {
                        return {};
                    } else {
                        return {
                            firstname: billingInfo?.firstName,
                            lastname: billingInfo?.lastName,
                            address: billingInfo?.address,
                            additional_address: billingInfo?.additional_address,
                            society: billingInfo?.society,
                            phone: billingInfo?.phone,
                            postalCode: billingInfo?.postalCode,
                        };
                    }
                };
                const createdDeliveryData = await new DeliverInfoModel({
                    user: req.user._id,
                    card: createdCard._id,
                    deliver_info: {
                        firstname: deliveryInfo?.firstName,
                        lastname: deliveryInfo?.lastName,
                        address: deliveryInfo?.address,
                        additional_address: deliveryInfo?.additional_address,
                        society: deliveryInfo?.society,
                        phone: deliveryInfo?.phone,
                        postalCode: deliveryInfo?.postalCode,
                    },
                    billing_info: isBillingSameAsDelivery(),
                    is_billing_same: is_billing_same_delivery,
                    comment_on,
                    promoCode,
                }).save();
                if (createdDeliveryData) {
                    const updatedCardData = await CardModel.findByIdAndUpdate(
                        createdCard._id,
                        {
                            $set: { delivery_info: createdDeliveryData?._id },
                        },
                        { new: true },
                    );
                    if (updatedCardData) {
                        const userWithProfile = await UserModel.findById(req.user._id).populate({ path: "profile", select: "_id" });
                        const updatedProfile = await ProfileModel.findByIdAndUpdate(
                            userWithProfile.profile._id,
                            {
                                $push: {
                                    cards: updatedCardData?._id,
                                },
                            },
                            { new: true },
                        );
                        res.json({ card_created: true, cardId: updatedCardData._id, delivery_id: createdDeliveryData._id, ordered_on: createdDeliveryData.orderDate });
                    }
                }
            }
        }
    } catch (e) {
        next(e);
    }
};

exports.getAllCardController = async (req, res, next) => {
    try {
        const { status } = req.query;
        const allCard = await CardModel.find(status && { card_status: status })
            .select("_id user card_status delivery_info")
            .populate({
                path: "user",
                select: "_id email",
                populate: {
                    path: "profile",
                    select: "firstname lastname",
                },
            })
            .populate({
                path: "delivery_info",
                select: "orderDate",
            });

        res.json(allCard);
    } catch (e) {
        next(e);
        console.log(e);
    }
};

exports.getSingleCardData = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const cardData = await CardModel.findById(id);
        res.json(cardData);
    } catch (e) {
        next(e);
    }
};
