(function() {
    // Define CSS styles for the chat widget and modal
    const styles = `
        #chat-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-family: Arial, sans-serif;
            z-index: 1000;
        }
        #chat-button {
            background-color: #ab8965;
            border: none;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            padding: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            transition: background-color 0.3s;
        }
        #chat-button:hover {
            background-color: #6d5740;
        }
        #chat-widget-full {
            display: none;
            position: absolute;
            bottom: 60px; /* Adjusted to position above the button */
            right: 0;
            min-width: 320px;
            max-width: 320px;
            max-height: 80vh; /* Maximum height relative to viewport height */
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            overflow: hidden; /* Hide any overflowing content */
        }
        #chat-body {
            padding: 20px;
            overflow: auto; /* Allows scrolling within the chat body if content overflows */
        }
        #chat-header {
            background-color: #ab8965;
            color: #ffffff;
            padding: 15px;
            font-weight: bold;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e0e0e0;
        }
        #chat-back {
            cursor: pointer;
            font-size: 18px;
            color: #ffffff;
            margin-right: 10px;
            display: none; /* Initially hidden */
        }
        #chat-close {
            cursor: pointer;
            font-size: 18px;
            color: #ffffff;
            margin-left: auto;
        }
        #chat-welcome {
            margin-bottom: 20px;
            font-size: 14px;
            color: #666666;
        }
        .chat-option {
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            border: none;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        }
        .chat-option:hover {
            background-color: #e0e0e0;
        }
        .chat-option-icon {
            font-size: 20px;
            margin-right: 10px;
        }
        .session-button {
            background-color: #ab8965;
            border: none;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            color: white;
            padding: 12px 20px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
            margin: 5px 0;
            text-align: center;
            transition: background-color 0.3s;
        }
        .session-button:hover {
            background-color: #6d5740;
        }
        #chat-footer {
            padding: 10px;
            text-align: center;
            font-size: 10px;
            color: #666666;
        }
    `;

    const modalStyles = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1001;
            display: none; /* Hidden by default; will be shown via JavaScript */
            justify-content: center;
            align-items: center;
        }

        .modal {
            background-color: #fff;
            border-radius: 10px;
            padding: 20px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh; /* Adjusted for scrolling within the viewport */
            position: relative;
            display: flex;
            flex-direction: column;
            overflow-y: auto; /* Enable vertical scrolling */
        }

        .modal iframe {
            width: 100%;
            height: 100%; /* Fill the modal content area */
            border: none;
            border-radius: 8px;
            flex-grow: 1; /* Allow the iframe to grow and fill available space */
        }

        .modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            cursor: pointer;
            font-size: 32px;
            color: #333;
            z-index: 1002;
        }

    `;

    // Append styles to the document head
    const modalStyleElement = document.createElement('style');
    const mainStyleElement = document.createElement('style');
    modalStyleElement.textContent = modalStyles;
    mainStyleElement.textContent = styles;
    document.head.appendChild(modalStyleElement);
    document.head.appendChild(mainStyleElement);

    // Define HTML structure for the chat widget and modal
    const chatWidgetHTML = `
        <div id="chat-widget">
            <div id="chat-button">
                <span id="chat-button-icon">💬</span>
            </div>

            <div id="chat-widget-full">
                <div id="chat-header">
                    <div id="chat-back">&larr;</div>
                    <span><h5 id="chat-title">AI Virtual Assistant</h5></span>
                    <div id="chat-close">×</div>
                </div>

                <div id="chat-body">
                    <div id="chat-welcome">
                        <h5>👋 Hi! Please choose <br>any of the options below:</h5>
                    </div>

                    <div id="chat-menu">
                        <button class="chat-option" data-target="chat">
                            <span class="chat-option-icon">💬</span>
                            Chat with us
                        </button>
                        <button class="chat-option" data-target="book">
                            <span class="chat-option-icon">📅</span>
                            Book your EESession
                        </button>
                        <a href="tel:+18888999726"><button class="chat-option" data-target="call">📞 Call for help</button></a>
                    </div>

                    <div id="chat-canvas" style="display: none;">
                        <h4 id="canvas-title"></h4>
                        <div id="canvas-content"></div>
                    </div>
                </div>

                <div id="chat-footer">
                    <p>Powered by <b>RYSEUP.AI</b></p>
                </div>
            </div>
        </div>   
    `;

    // Modal for booking
    const modalHTML = `
    <div id="modal-overlay" class="modal-overlay">
        <div class="modal">
            <span id="modal-close" class="modal-close">×</span>
            <iframe id="modal-iframe" src="" frameborder="0"></iframe>
        </div>
    </div> 
    `;

    // Append the modal HTML to the body
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);

    // Append the chat widget HTML to the body
    const div = document.createElement('div');
    div.innerHTML = chatWidgetHTML;
    document.body.appendChild(div);

    // Get elements
    const chatButton = document.getElementById('chat-button');
    const chatWidgetFull = document.getElementById('chat-widget-full');
    const chatClose = document.getElementById('chat-close');
    const chatBack = document.getElementById('chat-back');
    const chatOptions = document.querySelectorAll('.chat-option');
    const chatWelcome = document.getElementById('chat-welcome');
    const chatMenu = document.getElementById('chat-menu');
    const chatCanvas = document.getElementById('chat-canvas');
    const canvasTitle = document.getElementById('canvas-title');
    const canvasContent = document.getElementById('canvas-content');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalIframe = document.getElementById('modal-iframe');

    // Show specific content
    function showMenu(menuId) {
        chatWelcome.style.display = 'none';
        chatMenu.style.display = 'none';
        chatCanvas.style.display = 'block';
        chatBack.style.display = 'block'; // Show back button

        if (menuId === 'chat') {
            canvasTitle.innerHTML = '💬 Chat with us';
            canvasContent.innerHTML = `
                <iframe
                    src="https://api.ryseupsolutionsllc.com/widget/form/zs76fXHuH6fIahxZvDjv"
                    style="width:100%;height:100%;border:none;border-radius:32px"
                    id="inline-zs76fXHuH6fIahxZvDjv" 
                    data-layout="{'id':'INLINE'}"
                    data-trigger-type="alwaysShow"
                    data-trigger-value=""
                    data-activation-type="alwaysActivated"
                    data-activation-value=""
                    data-deactivation-type="neverDeactivate"
                    data-deactivation-value=""
                    data-form-name="Any Niche Test Drive"
                    data-height="713"
                    data-layout-iframe-id="inline-zs76fXHuH6fIahxZvDjv"
                    data-form-id="zs76fXHuH6fIahxZvDjv"
                    title="Any Niche Test Drive"
                ></iframe>
            `;
        } else if (menuId === 'book') {
            canvasTitle.innerHTML = '📅 Book your EESession';
            canvasContent.innerHTML = `
                <button class="session-button" data-session="1-hour">🔹 1-hour Session</button>
                <button class="session-button" data-session="2-hour">🔸 2-hour Session</button>
                <button class="session-button" data-session="overnight">🌙 Overnight Session</button>
            `;
        } else if (menuId === 'call') {
            canvasTitle.innerHTML = '📞 Call for help';
            canvasContent.innerHTML = '<p>Feel free to reach out at <a href="tel:+18888999726">1-888-899-9726</a> for further assistance.</p>';
        }
    }

    function showModal(iframeUrl) {
        modalIframe.src = iframeUrl;
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    // Event listeners for chat buttons and menu navigation
    chatButton.addEventListener('click', function() {
        chatWidgetFull.style.display = 'block';
    });

    chatClose.addEventListener('click', function() {
        chatWidgetFull.style.display = 'none';
        resetChatMenu();
    });

    chatBack.addEventListener('click', function() {
        resetChatMenu();
    });

    chatOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            const target = option.getAttribute('data-target');
            showMenu(target);
        });
    });

    // Reset chat to menu view
    function resetChatMenu() {
        chatWelcome.style.display = 'block';
        chatMenu.style.display = 'block';
        chatCanvas.style.display = 'none';
        chatBack.style.display = 'none';
    }

    // Handle session button clicks and open modal
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('session-button')) {
            const sessionType = event.target.getAttribute('data-session');
            let iframeUrl = '';

            switch (sessionType) {
                case '1-hour':
                    iframeUrl = 'https://api.ryseupsolutionsllc.com/widget/bookings/booksession-main-menu';
                    break;
                case '2-hour':
                    iframeUrl = 'https://api.ryseupsolutionsllc.com/widget/bookings/booksession-main-menub9eeb5';
                    break;
                case 'overnight':
                    iframeUrl = 'https://calendly.com/eesession-overnight';
                    break;
            }

            showModal(iframeUrl);
            modalOverlay.style.display = 'flex';
            modalOverlay.style.overflowY = 'auto';
        }
    });

    // Event listeners
    chatButton.addEventListener('click', () => {
        chatWidgetFull.style.display = 'block';
    });

    chatClose.addEventListener('click', () => {
        chatWidgetFull.style.display = 'none';
    });

    chatBack.addEventListener('click', () => {
        chatBack.style.display = 'none'; // Hide back button
        chatCanvas.style.display = 'none';
        chatWelcome.style.display = 'block';
        chatMenu.style.display = 'block';
    });

    chatOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            showMenu(target);
        });
    });

    modalClose.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        modalIframe.src = ''; // Clear the iframe source
        document.body.style.overflow = ''; // Restore scrolling
    });
})();
