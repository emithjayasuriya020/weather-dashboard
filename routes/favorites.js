import express from 'express';
import User from '../models/User.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/add', verifyToken, async (req, res) => {
    try {
        const { cityName, countryCode, lat, lon } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found in the database!' });
        }

        if (!user.favoriteCities) {
            user.favoriteCities = [];
        }

        const cityExists = user.favoriteCities.find(city => city.cityName === cityName);
        if (cityExists) {
            return res.status(400).json({ message: 'City is already in your favorites!' });
        }

        user.favoriteCities.push({ cityName, countryCode, lat, lon });
        
        await user.save();

        res.status(200).json({ 
            message: `${cityName} added to favorites!`, 
            favoriteCities: user.favoriteCities 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while saving city!' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user){
            return res.status(404).json({message: 'User not found!' });
        }

        res.status(200).json(user.favoriteCities);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error while fetching cities!' });
    }
});

router.delete('/remove/:cityName', verifyToken, async (req, res) => {
    try {
        const { cityName } = req.params;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User Not Found!' });
        }

        user.favoriteCities = user.favoriteCities.filter(
            (city) => city.cityName !== cityName
        );

        await user.save();

        res.status(200).json({
            message: `${cityName} removed from favorites!`,
            favoriteCities: user.favoriteCities
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while removing city!' });
    }
});

export default router;