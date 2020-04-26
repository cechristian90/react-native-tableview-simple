import React from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextProps,
  TextStyle,
} from 'react-native';

export interface CellInterface {
  accessory?:
    | false
    | 'DisclosureIndicator'
    | 'Detail'
    | 'DetailDisclosure'
    | 'Checkmark';
  accessoryColor?: ViewStyle['borderColor'] | TextStyle['color'];
  accessoryColorDisclosureIndicator?: ViewStyle['borderColor'];
  allowFontScaling?: boolean;
  backgroundColor?: ViewStyle['backgroundColor'];
  cellStyle?: 'Basic' | 'RightDetail' | 'LeftDetail' | 'Subtitle';
  cellAccessoryView?: React.ReactNode;
  cellContentView?: React.ReactNode;
  cellImageView?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  detail?: string | number;
  detailTextStyle?: StyleProp<TextStyle>;
  detailTextProps?: TextProps;
  disableImageResize?: boolean;
  hideSeparator?: boolean;
  highlightActiveOpacity?: number;
  highlightUnderlayColor?: ViewStyle['backgroundColor'];
  image?: React.ReactElement;
  isDisabled?: boolean;
  onPress?: () => void | false;
  onPressDetailAccessory?: () => void | false;
  onUnHighlightRow?(): void;
  onHighlightRow?(): void;
  leftDetailColor?: TextStyle['color'];
  rightDetailColor?: TextStyle['color'];
  subtitleColor?: TextStyle['color'];
  subtitleTextStyle?: StyleProp<TextStyle>;
  testID?: string;
  title?: React.ReactNode;
  titleTextProps?: TextProps;
  titleTextStyle?: StyleProp<TextStyle>;
  titleTextStyleDisabled?: StyleProp<TextStyle>;
  titleTextColor?: TextStyle['color'];
  withSafeAreaView?: boolean;
}

const Cell: React.FC<CellInterface> = ({
  accessory = false,
  accessoryColor = '#007AFF',
  accessoryColorDisclosureIndicator = '#C7C7CC',
  allowFontScaling = true,
  backgroundColor = '#FFF',
  cellStyle = 'Basic',
  cellContentView,
  cellImageView,
  cellAccessoryView,
  contentContainerStyle = {},
  detail,
  detailTextStyle = {},
  detailTextProps = {},
  disableImageResize = false,
  highlightActiveOpacity = 0.8,
  highlightUnderlayColor = '#000',
  image,
  isDisabled = false,
  onPress,
  onPressDetailAccessory,
  onHighlightRow,
  onUnHighlightRow,
  leftDetailColor = '#007AFF',
  rightDetailColor = '#8E8E93',
  subtitleColor = '#000',
  subtitleTextStyle = {},
  testID,
  title,
  titleTextProps = {},
  titleTextStyle = {},
  titleTextStyleDisabled = {},
  titleTextColor = '#000',
  withSafeAreaView = Platform.OS === 'ios'
    ? parseInt(`${Platform.Version}`, 10) <= 10
      ? false
      : true
    : true,
}: CellInterface) => {
  const isPressable = !!onPress;

  /**
   * Merge styles with props
   */
  const _styles = {
    ...styles,
    cell: [
      styles.cell,
      {
        backgroundColor,
      },
      contentContainerStyle,
    ],
    cellSafeAreaContainer: [
      styles.cellSafeAreaContainer,
      {
        backgroundColor,
      },
    ],
    cellTitle: isDisabled
      ? [styles.cellTitle, styles.cellTextDisabled, titleTextStyleDisabled]
      : [styles.cellTitle, { color: titleTextColor }, titleTextStyle],
    cellLeftDetail: [
      styles.cellLeftDetail,
      {
        color: leftDetailColor,
      },
      detailTextStyle,
    ],
    cellLeftDetailTitle: isDisabled
      ? [styles.cellLeftDetailTitle, styles.cellTextDisabled]
      : [styles.cellLeftDetailTitle, { color: titleTextColor }],
    cellRightDetail: [
      styles.cellRightDetail,
      {
        color: rightDetailColor,
      },
      detailTextStyle,
    ],
    cellSubtitle: [
      styles.cellSubtitle,
      {
        color: subtitleColor,
      },
      subtitleTextStyle,
    ],
    accessoryCheckmark: [
      styles.accessoryCheckmark,
      { borderColor: accessoryColor },
    ],
    accessoryDetail: [styles.accessoryDetail, { borderColor: accessoryColor }],
    accessoryDetailText: [
      styles.accessoryDetailText,
      { color: accessoryColor },
    ],
    accessoryDisclosureIndicator: [
      styles.accessoryDisclosureIndicator,
      { borderColor: accessoryColorDisclosureIndicator },
    ],
  };

  const renderAccessoryDetail = (): React.ReactNode => {
    if (onPressDetailAccessory) {
      return (
        <TouchableOpacity
          style={_styles.accessoryDetail}
          onPress={onPressDetailAccessory}
          activeOpacity={0.7}
          disabled={isDisabled}>
          <Text style={_styles.accessoryDetailText}>i</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={_styles.accessoryDetail}>
        <Text style={_styles.accessoryDetailText}>i</Text>
      </View>
    );
  };
  /**
   * Render accessoryView
   * Currently available
   * @return {View} View with accessory
   */
  const renderAccessoryView = (): React.ReactNode => {
    switch (accessory) {
      case 'DisclosureIndicator':
        return (
          <View style={_styles.cellAccessoryView}>
            <View style={_styles.accessoryDisclosureIndicator} />
          </View>
        );
      case 'Detail':
        return (
          <View style={_styles.cellAccessoryView}>
            {renderAccessoryDetail()}
          </View>
        );
      case 'DetailDisclosure':
        return (
          <View style={_styles.cellAccessoryView}>
            <View style={_styles.accessoryDetailDisclosure}>
              {renderAccessoryDetail()}
              <View style={_styles.accessoryDisclosureIndicator} />
            </View>
          </View>
        );
      case 'Checkmark':
        return (
          <View style={_styles.cellAccessoryView}>
            <View style={_styles.accessoryCheckmark} />
          </View>
        );
      default:
        return null;
    }
  };

  /**
   * Render imageView
   * @return {Image} Image component with updated props
   */
  const renderImageView = (): React.ReactNode => {
    if (!image) {
      return null;
    }
    const propsToAdd = {
      style: disableImageResize
        ? image.props.style
        : [image.props.style, _styles.image],
    };
    return (
      <View style={_styles.cellImageView}>
        {React.cloneElement(image, propsToAdd)}
      </View>
    );
  };

  /**
   * Render cell of type Basic
   * @return {View} View with Text and Accessory
   */
  const renderCellBasic = (): React.ReactNode => (
    <View style={_styles.cellContentView}>
      <Text
        allowFontScaling={allowFontScaling}
        numberOfLines={1}
        style={_styles.cellTitle}
        {...titleTextProps}>
        {title}
      </Text>
    </View>
  );

  /**
   * Render cell of type RightDetail
   * @return {View} View with Text, Text and Accessory
   */
  const renderCellRightDetail = (): React.ReactNode => (
    <View style={_styles.cellContentView}>
      <Text
        allowFontScaling={allowFontScaling}
        numberOfLines={1}
        style={_styles.cellTitle}
        {...titleTextProps}>
        {title}
      </Text>
      <Text
        allowFontScaling={allowFontScaling}
        numberOfLines={1}
        style={
          isDisabled
            ? [_styles.cellRightDetail, _styles.cellTextDisabled]
            : _styles.cellRightDetail
        }
        {...detailTextProps}>
        {detail}
      </Text>
    </View>
  );

  /**
   * Render cell of type LeftDetail
   * @return {View} View with Text, Text and Accessory
   */
  const renderCellLeftDetail = (): React.ReactNode => (
    <View style={_styles.cellContentView}>
      <Text
        allowFontScaling={allowFontScaling}
        numberOfLines={1}
        style={
          isDisabled
            ? [_styles.cellLeftDetail, _styles.cellTextDisabled]
            : _styles.cellLeftDetail
        }
        {...detailTextProps}>
        {detail}
      </Text>
      <Text
        allowFontScaling={allowFontScaling}
        numberOfLines={1}
        style={_styles.cellLeftDetailTitle}
        {...titleTextProps}>
        {title}
      </Text>
    </View>
  );

  /**
   * Render cell of type Subtitle
   * @return {View} View with View, Text, Text and Accessory
   */
  const renderCellSubtitle = (): React.ReactNode => (
    <View
      style={[_styles.cellContentView, _styles.cellContentViewTypeSubtitle]}>
      <View style={_styles.cellInnerSubtitle}>
        <Text
          allowFontScaling={allowFontScaling}
          numberOfLines={1}
          style={_styles.cellTitle}
          {...titleTextProps}>
          {title}
        </Text>
        <Text
          allowFontScaling={allowFontScaling}
          numberOfLines={1}
          style={
            isDisabled
              ? [_styles.cellSubtitle, _styles.cellTextDisabled]
              : _styles.cellSubtitle
          }
          {...detailTextProps}>
          {detail}
        </Text>
      </View>
    </View>
  );

  /**
   * Renders correct contentView
   * @return {View} ContentView
   */
  const renderCellContentView = (): React.ReactNode => {
    switch (cellStyle) {
      case 'Basic':
        return renderCellBasic();
      case 'RightDetail':
        return renderCellRightDetail();
      case 'LeftDetail':
        return renderCellLeftDetail();
      case 'Subtitle':
        return renderCellSubtitle();
      default:
        return renderCellBasic();
    }
  };

  /**
   * Render content of cell
   * @return {View} Complete View with cell elements
   */
  const renderCell = (): React.ReactNode => (
    <View style={_styles.cell}>
      {cellImageView || renderImageView()}
      {cellContentView || renderCellContentView()}
      {cellAccessoryView || renderAccessoryView()}
    </View>
  );

  /**
   * Render content of cell with SafeAreaView
   * Inside view to prevent overwriting styles
   * @return {View} Complete View with cell elements
   */
  const renderCellWithSafeAreaView = (): React.ReactNode => (
    <SafeAreaView style={_styles.cellSafeAreaContainer}>
      <View style={_styles.cell}>
        {cellImageView || renderImageView()}
        {cellContentView || renderCellContentView()}
        {cellAccessoryView || renderAccessoryView()}
      </View>
    </SafeAreaView>
  );

  if (isPressable && !isDisabled) {
    return (
      <TouchableHighlight
        activeOpacity={highlightActiveOpacity}
        onPress={onPress}
        underlayColor={highlightUnderlayColor}
        onPressIn={onHighlightRow}
        onPressOut={onUnHighlightRow}
        testID={testID}>
        {withSafeAreaView ? renderCellWithSafeAreaView() : renderCell()}
      </TouchableHighlight>
    );
  }
  return (
    <View testID={testID}>
      {withSafeAreaView ? renderCellWithSafeAreaView() : renderCell()}
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 20,
    minHeight: 44,
    flexDirection: 'row',
  },
  // SafeAreaView only adds padding
  cellSafeAreaContainer: {
    flex: 1,
  },
  cellContentView: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    // independent from other cellViews
    paddingVertical: 10,
  },
  cellContentViewTypeSubtitle: {
    paddingVertical: 4,
  },
  cellInnerSubtitle: {
    flexDirection: 'column',
    flex: 1,
  },
  cellTitle: {
    fontSize: 16,
    letterSpacing: -0.32,
    flex: 1,
  },
  cellLeftDetailTitle: {
    fontSize: 12,
    flex: 1,
  },
  cellLeftDetail: {
    fontSize: 12,
    alignSelf: 'center',
    textAlign: 'right',
    marginRight: 5,
    width: 75,
  },
  cellRightDetail: {
    fontSize: 16,
    letterSpacing: -0.32,
    alignSelf: 'center',
    color: '#8E8E93',
  },
  cellSubtitle: {
    fontSize: 11,
    letterSpacing: 0.066,
  },
  cellTextDisabled: {
    color: 'gray',
  },
  cellImageView: {
    justifyContent: 'center',
    marginRight: 15,
  },
  image: {
    height: 29,
    width: 29,
  },
  cellAccessoryView: {
    justifyContent: 'center',
  },
  accessoryDisclosureIndicator: {
    width: 10,
    height: 10,
    marginLeft: 7,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#c7c7cc',
    transform: [
      {
        rotate: '45deg',
      },
    ],
  },
  accessoryDetail: {
    width: 20,
    height: 20,
    marginLeft: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessoryDetailText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Georgia',
    letterSpacing: -0.24,
  },
  accessoryDetailDisclosure: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessoryCheckmark: {
    width: 13,
    height: 6,
    marginLeft: 7,
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#007AFF',
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
});

export default Cell;
