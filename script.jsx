require.config({
	paths: {
		text: './lib/text',
		json: './lib/json'
	}
});


var Tree = React.createClass({
	getInitialState: function() {
		return {
			fs: null
		};
	},

	componentDidMount: function() {
		var self = this;
		require(['json!./fs.json'], function(fs) {
			self.setState({
				fs: fs
			});
		});
	},

	render: function() {
		if (!this.state.fs) {
			return (
				<div className="tree-folder m-open m-loading"></div>
			);
		} else {
			return (
				<div className="tree-folder m-open">
					<Item data={this.state.fs} />
				</div>
			);
		}
	}
});

var Item = React.createClass({
	getDefaultProps: function() {
		return {
			data: null
		};
	},
	getInitialState: function() {
		return {
			expanded: false
		};
	},
	toggleExpand: function(e) {
		e.preventDefault();
		this.setState({
			expanded: !this.state.expanded
		});
	},
	render: function() {
		var data = this.props.data;
		if (!data) return '';
		if (data.type === 0) {
			var expanded = this.state.expanded;
			var childrenList = <span className="tree-item_empty-text">Пустая папка</span>;
			if (data.children.length) {
				childrenList = data.children.map(function (childData, i) {
					return <Item data={childData} key={i}/>;
				});
			}
			return (
				<div className={'tree-item tree-folder' + (expanded? ' m-open' : '')}>
					<div className="tree-item_header" onClick={this.toggleExpand}>
						{data.name}
					</div>
					<div className={'tree-list' + (data.children.length? '' : ' m-empty')}>
						{childrenList}
					</div>
				</div>
			);
		} else if (data.type === 1) {
			return (
				<div className="tree-item tree-file">
					<div className="tree-item_header">
						{data.name}
					</div>
				</div>
			);
		}
	}
});

ReactDOM.render(<Tree />, document.getElementById('tree'));



