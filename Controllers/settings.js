import asyncHandler from "express-async-handler";
import DealershipInfo from "../Models/dealershipInfoModel.js";
import User from "../Models/userModel.js";

export const getDealershipInfo = asyncHandler(async (req, res, next) => {
    try {
        let dealerShip = await DealershipInfo.findOne({}).populate("workingHours");

        if (!dealerShip) {

            const defaulWorkingHours = [
                {
                    dayOfWeek: "MONDAY",
                    openTime: "09:00",
                    closeTime: "18:00",
                    isOpen: true,
                },
                {
                    dayOfWeek: "TUESDAY",
                    openTime: "09:00",
                    closeTime: "18:00",
                    isOpen: true,
                },
                {
                    dayOfWeek: "WEDNESDAY",
                    openTime: "09:00",
                    closeTime: "18:00",
                    isOpen: true,
                },
                {
                    dayOfWeek: "THURSDAY",
                    openTime: "09:00",
                    closeTime: "18:00",
                    isOpen: true,
                },
                {
                    dayOfWeek: "FRIDAY",
                    openTime: "09:00",
                    closeTime: "18:00",
                    isOpen: true,
                },
                {
                    dayOfWeek: "SATURDAY",
                    openTime: "10:00",
                    closeTime: "16:00",
                    isOpen: true,
                },
                {
                    dayOfWeek: "SUNDAY",
                    openTime: "10:00",
                    closeTime: "16:00",
                    isOpen: false,
                }
            ]
            dealerShip = await DealershipInfo.create({
                workingHours: defaulWorkingHours
            });

        }
        return res.send(dealerShip);
    } catch (err) {
        const error = new Error("Failed to fetch Dealership");
        next(error);
    }

});

export const saveWorkingHours = asyncHandler(async (req, res, next) => {
    const { workingHours } = req.body;
    try {
        let dealerShip = await DealershipInfo.findOne({});

        if (!dealerShip) {
            throw new Error("Dealership not found");
        }

        dealerShip = await DealershipInfo.findByIdAndUpdate(dealerShip._id, {
            $set: { workingHours }
        }, { new: true });


        res.send(dealerShip);
    } catch (err) {
        next(err);
    }
})

export const getUsers = asyncHandler(async (req, res, next) => {
    const keyword = {
        $or: [
            { name: { $regex: `${req.query.search}`, $options: "i" } },
            { email: { $regex: `${req.query.search}`, $options: "i" } },
        ]
    };

    try {
        const users = await User.find(keyword).sort({ createdAt: -1 });

        res.send(users);

    } catch (err) {
        const error = new Error("Error fetching users");
        next(err);
    }
});

export const updateUserRole = asyncHandler(async (req, res, next) => {
    const { userId, role } = req.body;

    try {
        await User.findByIdAndUpdate(userId, {
            $set: { role }
        });

        return res.json({message : "User updated successfully"});

    } catch (err) {
        const error = new Error("Error updating user");
        next(error);
    }


});


// module.exports = {
//     getDealershipInfo,
//     saveWorkingHours,
//     updateUserRole ,
//     getUsers
// }
