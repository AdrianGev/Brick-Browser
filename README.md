# Brick Browser - Highly Customizable Web Browser

Brick Browser is a browser built brick by brick (by you)

## Features that arent here YET

- **Fully Customizable UI**: Change tab positions, toggle sidebar, customize title bar, and more
- **Themes**: Switch between light and dark modes or use system default
- **Custom CSS & JavaScript**: Inject your own CSS and JavaScript into web pages
- **Privacy Features**: Ad blocking, tracker blocking, Do Not Track support, and cookie management
- **Extensions Support**: Install and manage browser extensions
- **Multiple Tabs**: Efficient tab management with customizable tab bar
- **Bookmarks**: Save and organize your favorite websites
- **Modern Interface**: Clean, intuitive design with smooth animations

## Customization Options

- **Appearance**: 
  - Light/Dark themes
  - Tab position (top, bottom, left, right)
  - Show/hide sidebar
  - Show/hide bookmarks bar
  - Custom title bar

- **Privacy**:
  - Ad blocking
  - Tracker blocking
  - Do Not Track requests
  - Clear cookies on exit

- **Advanced**:
  - Custom CSS injection
  - Custom JavaScript injection
  - Extension management

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm fr

### Installation

1. clone:
```
git clone https://github.com/yourusername/brick-browser.git
cd brick-browser
```

2. install dependencies:
```
npm install
cd src
npm install
cd ..
```

3. start the application:
```
npm run dev
```

## Development

- `npm run dev` - start the application in dev mode
- `npm run build` - build the application for prod

## Project Structure

- `main.js` - Electron main process
- `preload.js` - Preload script for secure IPC communication (google it)
- `src/` - React application
  - `components/` - UI components
  - `contexts/` - React contexts (theme, etc.)
  - `store.js` - Application state management

## Customizing Your Browser (also not here yet)

1. open the browser and click the settings icon in the sidebar
2. navigate through the different tabs to customize various aspects of the browser
3. apply custom CSS and JavaScript in the Advanced tab
4. save your changes and restart the browser if necessary

## License

MIT
