var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from "express-async-handler";
import { isString } from "../type_check/string";
import courseCategoryCollection from "../models/course_category";
import subCategoryCollection from "../models/course_sub_category";
export const getCategories = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield courseCategoryCollection.find({});
    if (!categories)
        throw new Error('no categories available');
    res.json({ categories });
}));
export const getSubCategories = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subCat = yield subCategoryCollection.find({});
    if (!subCat)
        throw new Error('no categories available');
    res.json({ subCategories: subCat });
}));
export const addCategory = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    if (isString(!title))
        throw new Error('invalid category title');
    const lowerTitle = title.toLowerCase();
    const isExist = yield courseCategoryCollection.findOne({ name: lowerTitle });
    if (isExist)
        throw new Error('course name already exists');
    const newCategory = yield courseCategoryCollection.create({ name: lowerTitle, description });
    res.json({ newCategory });
}));
export const addSubCategory = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, category } = req.body;
    const isCourseExist = yield courseCategoryCollection.findById(category);
    if (!isCourseExist)
        throw new Error('no course existing with provided id');
    if (isString(!title))
        throw new Error('invalid category title');
    const lowerTitle = title.toLowerCase();
    const newSubCategory = yield subCategoryCollection.create({ name: lowerTitle, description, category });
    res.json({ newSubCategory });
}));
