const Item = require("../models/item.model")

const getAllItems = async (req, res) => {
    try {
        const data = await Item.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: data,
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: 'Server error while fetching reservations'
        });
    }
}

const createNewItem = async (req, res) => {
  console.log("REQ BODY:", req.body);
console.log("REQ FILE:", req.file);

    try {
      const { 
        codeName,
        model,
        type,
        status
      } = req.body

    
      const newItem = new Item({
        codeName,
        type,
        model,
        status,
        imgUrl: `/uploads/items/${req.file.filename}`,
      });

      await newItem.save()

      res.status(200).json({
          success: true,
          data: newItem,
          test: req.file.filename
      })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: `Server error while creating item : `
        });
    }
}

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the item first
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Delete the associated image file if exists
        if (item.imgUrl) {
            const filePath = path.join(__dirname, "..", item.imgUrl);
            fs.unlink(filePath, (err) => {
                if (err) console.log("Failed to delete file:", err.message);
            });
        }

        // Delete the item from DB
        await Item.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Item deleted successfully",
            data: item
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Server error while deleting item"
        });
    }
}

module.exports = { getAllItems, createNewItem, deleteItem }