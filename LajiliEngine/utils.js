// See my super games on http://lajili.com
define([], function()
{
	function metters(pixels)
	{
		return pixels/100; // Convert pixel in metters
	}

	function pixels(metters)
	{
		return metters*100; // Convert metters in pixels
	}

	return {
		metters : metters,
		pixels : pixels
	}
}
)