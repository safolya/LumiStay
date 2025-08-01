const express = require('express');
const router = express.Router();

router.get('/about', (req, res) => {
    res.render('pages/about');
});

router.get('/terms', (req, res) => {
    res.render('pages/terms');
});

router.get('/privacy', (req, res) => {
    res.render('pages/privacy');
});

router.get('/contact', (req, res) => {
    res.render('pages/contact');
});

router.get('/faq', (req, res) => {
    res.render('pages/faq');
});

module.exports = router;
