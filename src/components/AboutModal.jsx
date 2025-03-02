
import './AboutModal.css'

export default function AboutModal()
{
    //useEffect(() => { console.log("body render");});

    function modalClose()
    {


        let modal = document.getElementById("about-modal-wrapper");

        modal.style.opacity = "0";
        modal.style.visibility = "hidden";



        document.getElementById("about-modal-open").value = "false";


    }

    function handleClick(event)
    {
        if(event.target.id == "modal-close" || event.target.id == "modal-close-icon" || event.target.id == "modal-close-path")
        {
            modalClose();
        }
        else if(event.target.id == "modal-close-button")
        {
            modalClose();
        }
        else if(event.target.id == "about-modal-wrapper")
        {
            modalClose();
        }
    }

    return (
        <>
            <div className="modal-wrapper" id="about-modal-wrapper" onClick={handleClick}>
                <div className="modal-window">
                    <div className="modal-header">
                        <div className="modal-nav"></div>
                        <div className="modal-title">About</div>
                        <div className="modal-nav" id="modal-close" onClick={handleClick}>
                            <svg id="modal-close-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                                <path id="modal-close-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="modal-body" id="about-modal-body">
                    Comming soon.
                    </div>
                    <div className="add-modal-footer">
                        <input id="about-modal-id-hidden" type="hidden" value=""/>
                        <input id="about-modal-open" type="hidden" value="false"/>
                        <button type="button" id="modal-close-button" onClick={handleClick}>Close</button>
                    </div>
                </div>
            </div>
        </>);
    return (<></>);
}