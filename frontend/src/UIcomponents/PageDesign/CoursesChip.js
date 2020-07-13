import React, { PureComponent } from 'react';
import { Chip } from 'react-md';

export default class CourseChip extends PureComponent {
  handleRemove = () => {
    this.props.onClick(this.props.course);
  };

  render() {
    const { course, ...props } = this.props;
    return (
      <Chip
        {...props}
        className="course-chip"
        onClick={this.handleRemove}
        removable
        label={course}
      />
    );
  }
}