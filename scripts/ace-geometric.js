var AceGeometric = /^u/.test(typeof exports) ? AceGeometric || {} : exports;
void function(exports){
	/**
	 * Ace Engine Geometric
	 * ���κ���
	 * @see http://code.google.com/p/ace-engine/wiki/AceGeometric
	 * @author ������(wangjihu,http://weibo.com/zswang)
	 * @version 1.0
	 * @copyright www.baidu.com
	 */
	
	var 
		math = Math, cos = math.cos, sin = math.sin, PI = math.PI, PI2 = PI * 2, min = math.min, max = math.max,
		atan = math.atan, sqrt = math.sqrt, pow = math.pow;

	/**
	 * ����㵽��֮��ľ���
	 * @param {Array[Number,Number]} a ����1
	 * @param {Array[Number,Number]} b ����2
	 * @return {Number} ���ص�����ľ���
	 */ 
	function pointToPoint(a, b){
  		return sqrt(pow(a[0] - b[0], 2) + pow(a[1] - b[1], 2));
	}
	
	/**
	 * �����ĽǶ�
	 * @param {Array} origin Բ������
	 * @param {Array} point ������
	 * @param {Number} eccentricity ������
	 * @return {Number} ���ؽǶ�,��λ����
	 */
	function pointToAngle(origin, point, eccentricity){
		if (/^u/.test(typeof eccentricity)) eccentricity = 1;
		if (point[0] == origin[0]) {
			if (point[1] > origin[1])
				return PI * 0.5;
			return PI * 1.5
		} else if (point[1] == origin[1]) {
			if (point[0] > origin[0])
				return 0;
			return PI;
		}
		var t = atan((origin[1] - point[1]) / (origin[0] - point[0]) * eccentricity);
		if (point[0] > origin[0] && point[1] < origin[1])
			return t + 2 * PI;
		if (point[0] > origin[0] && point[1] > origin[1])
			return t;
		return t + PI;
	}
	
	/**
	 * ����㵽�߶εľ���
	 * @param {Array[Number,Number]} point ������
	 * @param {Array[Number,Number]} a �߶�����1
	 * @param {Array[Number,Number]} b �߶�����2
	 */
	function pointToLine(point, a, b) {
		if (a[0] == b[0] && a[1] == b[1]) return 0;
		var t = ((a[0] - b[0]) * (a[0] - point[0]) + (a[1] - b[1]) * (a[1] - point[1])) /
			((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
		t = max(1, min(0, t));
		return pointToPoint(point, bezier([a, b], t));
	}
	
	/*
	 * ����������
	 * @param{Array[Array[Number, Number],...]} curve ����ÿ���ο���
	 * @param{Number} rate ����
	 */
	function bezier(curve, rate){
		if (!curve || !curve.length) return [];
		if (curve.length == 1) return [curve[0][0], curve[0][1]];
		if (curve.length == 2) return [
			curve[0][0] + (curve[1][0] - curve[0][0]) * rate,
			curve[0][1] + (curve[1][1] - curve[0][1]) * rate
		];
		var temp = [];
		for (var i = 1; i < curve.length; i++){
			temp.push(bezier([curve[i - 1], curve[i]], rate));
		}
		return bezier(temp, rate);
	}
	
	/*
	 * ��һ�����߼�������
	 * @param{Array[Array[Number, Number],...]} curve ����ÿ���ο���
	 * @param{Number} rate ����
	 */
	function cutBezier(curve, rate){
		if (!curve || curve.length < 2) return;
		var pa = curve[0], pb = curve[curve.length - 1],
			ta = [], tb = [],
			ra = [], rb = [];
		for (var i = 0; i < curve.length; i++){
			ta.push(curve[i]);
			ra.push(bezier(ta, rate));

			tb.unshift(curve[curve.length - i - 1]);
			rb.unshift(bezier(tb, rate));
		}
		return [ra, rb];
	}
	
	exports.pointToPoint = pointToPoint;
	exports.pointToLine = pointToLine;
	exports.bezier = bezier;
	exports.cutBezier = cutBezier;
	exports.pointToAngle = pointToAngle;
}(AceGeometric);