import mongoose from "mongoose";

const dealershipInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "Autora Motors"
    },
    address: {
        type: String,
        required: true,
        default: "70 Car Street , Autoville , CA 69420"
    },
    phone: {
        type: String,
        required: true,
        default: "+1 (555) 123-4567"
    },
    email: {
        type: String,
        required: true,
        default: "contact@autora.com"
    },
    workingHours: {
        type: [
            {
                dayOfWeek: {
                    type: String,
                    enum: [
                        "MONDAY",
                        "TUESDAY",
                        "WEDNESDAY",
                        "THURSDAY",
                        "FRIDAY",
                        "SATURDAY",
                        "SUNDAY",
                    ],
                    required: true,
                },
                openTime: { type: String },
                closeTime: { type: String },
                isOpen: { type: Boolean, default: true },
            },
        ],
        default: [
            { dayOfWeek: "MONDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
            { dayOfWeek: "TUESDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
            { dayOfWeek: "WEDNESDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
            { dayOfWeek: "THURSDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
            { dayOfWeek: "FRIDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
            { dayOfWeek: "SATURDAY", openTime: "10:00", closeTime: "16:00", isOpen: true },
            { dayOfWeek: "SUNDAY", openTime: "10:00", closeTime: "16:00", isOpen: false },
        ],
    },
}, { timestamps: true });

const DealershipInfo = mongoose.model("DealershipInfo", dealershipInfoSchema);

export default DealershipInfo;