


export const Loading = () =>
{
    return (
        <div className="loader social-loader"><span></span></div>
    );
}

export const LoadingSection = ({ delay = "0s" }) => {
    return (
        <div
            style={{ animationDelay: delay }}
            className="loader"
        ><span></span></div>
    );
};
