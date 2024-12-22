


export const Loading = () =>
{
    return (
        <span className="loader social-loader"></span>
    );
}

export const LoadingSection = ({ delay = "0s" }) => {
    return (
        <span
            style={{ animationDelay: delay }}
            className="loader"
        ></span>
    );
};
