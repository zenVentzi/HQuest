const onFadedOut = child => {//has to return a function without parameters

  const newState = { ...this.state };
  debugger;
  if (child === FIRST) {
    newState.FirstVisible = false;
  } else {
    newState.SecondVisible = false;
  }

  this.setState(newState);
};

const fade = (action, child) {
  const Child = this.props.children[child];
  // return <div> fdfd </div>;
  // console.log({ action, child });
  return (
    <Animator
      action={action}
      onFadeIn={this.onFadeIn(child)}
      onFadedOut={this.onFadedOut(child)}
    >
      {Child}
    </Animator>
  );
}