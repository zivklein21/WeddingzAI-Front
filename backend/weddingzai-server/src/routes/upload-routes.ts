import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
    if (!req.file) {
        console.log("No file uploaded");
        res.status(400).json({ error: "No file uploaded" });
        return
    }

    fs.readFile(req.file.path, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Error reading file" });
            return
        }

        try {
            JSON.parse(data);
            if (req.file) {
                res.json({ message: "Valid JSON file uploaded", fileName: req.file.originalname });

            }
        } catch (error) {
            res.status(400).json({ error: "Invalid JSON format" });
        }

        // Cleanup: Remove the uploaded file
        if (req.file) {
            fs.unlink(req.file.path, () => { });
        }
    });
});

export default router;
