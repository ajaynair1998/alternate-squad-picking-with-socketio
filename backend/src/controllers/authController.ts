import { Request, Response } from "express";

const authController = {
	post: async function (req: Request, res: Response) {
		try {
			res.status(200).json({
				success: true,
			});
			return;
		} catch (err: any) {
			console.log(err);
			res.status(500).json({ success: false });
			return;
		}
	},
};
export default authController;
