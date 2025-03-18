import { Request, Response } from "express";
import fs from "fs";

const uploadJsonFile = async (req: Request, res: Response) => {
    if (!req.file) {
        console.log("No file uploaded");
        res.status(400).json({ error: "No file uploaded" });
        return;
    }

    fs.readFile(req.file.path, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Error reading file" });
            return;
        }

        try {
            JSON.parse(data);
            if (req.file) {
                res.json({ message: "Valid JSON file uploaded", fileName: req.file.originalname });
            }
        } catch (error) {
            res.status(400).json({ error: "Invalid JSON format" });
            return;
        }

        // Cleanup: Remove the uploaded file
        if (req.file) {
            fs.unlink(req.file.path, () => { });
        }
    });
};

export default { uploadJsonFile };