const { uploadImageToCloudinary } = require("../config/imageUploader");
const categoryModel = require("../models/categoryModel")


const createCategoryCtrl = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const thumbnail = req.files?.image;

        if (!categoryName || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        const category = await categoryModel.create({
            categoryName,
            image: thumbnailImage.secure_url
        });

        return res.status(201).json({
            success: true,
            message: "Category Created Successfully!",
            category,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error in creating category API!",
        });
    }
};


const getAllCategoriesCtrl = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        return res.status(200).json({
            success: true,
            categories
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting  categories API!",
        });
    }
}


const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const existCategory = await categoryModel.findById(id);
        if (!existCategory) {
            return res.status(400).json({
                success: false,
                message: "Category Not Found",
            });
        }


        await categoryModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in deleting  category API!",
        });
    }
};

const updateCategoryCtrl = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const thumbnail = req.files?.image;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            });
        }

        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        let thumbnailImage = category.image;
        if (thumbnail) {
            const uploadedImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
            thumbnailImage = uploadedImage.secure_url;
        }

        category.categoryName = categoryName || category.categoryName;
        category.image = thumbnailImage;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category Updated Successfully!",
            category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in updating category API!",
        });
    }
};

module.exports = { createCategoryCtrl, getAllCategoriesCtrl, deleteCategory, updateCategoryCtrl }