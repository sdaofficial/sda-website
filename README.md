# SDA - Sustainable Development Advocate

This website showcases the mission, events, team members, and joining information of the Sustainable Development Advocate organization at the University of Lagos.


## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with CSS variables
- **Vanilla JavaScript**: No frameworks, pure JavaScript for all interactivity
- **JSON**: Data storage for events and team members

## Getting Started
### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Start a local web server:

   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   ```

   **Using Node.js (http-server):**
   ```bash
   npx http-server
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```
4. Open your browser and navigate to `http://localhost:8000`


## Customization

### Colors

All colors are defined as CSS variables in `css/global.css`:

```css
:root {
  --color-primary: #DB5026;
  --color-primary-600: #C54822;
  --color-primary-400: #F1582A;
  /* ... more color variables */
}
```

### Fonts

The project uses the **Satoshi** font family, located in `resources/fonts/satoshi/`. The font is imported in `css/global.css`.


### Adding Team Members

Edit `team-members.json` to add or modify team members. The structure supports multiple tabs (e.g., executives, members):

```json
{
  "executives": [
    {
      "name": "John Doe",
      "title": "President",
      "image": "resources/images/people/john-doe.png"
    }
  ]
}
```


**Built with ❤️ for SDA**
---
- Instagram: [@sdaunilag](https://instagram.com/sdaunilag)
- Twitter: [@sdaunilag](https://twitter.com/sdaunilag)
- LinkedIn: [SDA Unilag](https://www.linkedin.com/company/sdaunilag)
- YouTube: [Sustainable Development Advocate](https://www.youtube.com/@sustainabledevelopmentadvo7259)
