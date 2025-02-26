import './OptionsMenu.css'




export default function OptionsMenu(props)
{
    function handleClick(event)
    {
        if(event.target.id == "options-menu-close-cell" || event.target.id == "options-icon-close" || event.target.id == "options-icon-path")
        {
            let optionsMenuWrapper = document.getElementById('options-menu-wrapper');

            optionsMenuWrapper.style.transition = "width 1s ease-in-out, opacity 1s ease-in-out,visibility 1s ease-in-out";

            optionsMenuWrapper.style.visibility = "hidden";
            optionsMenuWrapper.style.width = "0px";
            optionsMenuWrapper.style.opacity = "0";
        }
    }


    return (
        <div id="options-menu-wrapper">
            <div id="options-menu-nav-bar">
                <div className="options-menu-nav-cell" id="options-menu-title-cell">
                    <span>Options Menu</span>
                </div>
                <div className="options-menu-nav-cell" id="options-menu-close-cell" onClick={handleClick}>
                    <svg id="options-icon-close" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path id="options-icon-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}